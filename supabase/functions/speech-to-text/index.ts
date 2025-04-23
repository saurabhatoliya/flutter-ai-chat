
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { audio } = await req.json()

    if (!audio) {
      throw new Error('No audio data provided')
    }

    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0))

    // Upload audio to AssemblyAI
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': Deno.env.get('ASSEMBLY_AI_KEY') || '',
        'Content-Type': 'application/octet-stream',
      },
      body: binaryAudio
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error(`AssemblyAI upload error: ${errorText}`)
      throw new Error(`AssemblyAI upload error: ${errorText}`)
    }

    const { upload_url } = await uploadResponse.json()

    // Start transcription
    const transcribeResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': Deno.env.get('ASSEMBLY_AI_KEY') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: 'en'
      })
    })

    if (!transcribeResponse.ok) {
      const errorText = await transcribeResponse.text()
      console.error(`AssemblyAI transcription error: ${errorText}`)
      throw new Error(`AssemblyAI transcription error: ${errorText}`)
    }

    const transcription = await transcribeResponse.json()

    // Poll for transcription completion
    let result
    while (true) {
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcription.id}`, {
        headers: {
          'Authorization': Deno.env.get('ASSEMBLY_AI_KEY') || '',
        },
      })

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text()
        console.error(`AssemblyAI polling error: ${errorText}`)
        throw new Error(`AssemblyAI polling error: ${errorText}`)
      }

      result = await pollResponse.json()

      if (result.status === 'completed' || result.status === 'error') {
        break
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (result.status === 'error') {
      throw new Error(`Transcription failed: ${result.error}`)
    }

    console.log(`Transcription result: "${result.text}"`)

    return new Response(
      JSON.stringify({ text: result.text || '' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Speech-to-text error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
