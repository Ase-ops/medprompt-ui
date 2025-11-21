import React, { useState } from 'react'
import { Button, Upload, Input, Notification } from '@hi-ui/hiui'

export default function App() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const isDicom = (file) => file?.type === 'application/dicom' || file?.name?.endsWith('.dcm')

  async function analyze() {
    if (!file || !prompt) {
      Notification.open({ title: '⚠️ Please upload a DICOM file and enter a prompt', type: 'warning' })
      return
    }

    if (!isDicom(file)) {
      Notification.open({ title: '❌ File must be a DICOM (.dcm) file', type: 'error' })
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("dicom_file", file)
      formData.append("prompt", prompt)

      const res = await fetch("https://medprompt-backend.onrender.com/analyze", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)

      Notification.open({ title: '✅ Analysis complete', type: 'success' })
    } catch (error) {
      Notification.open({ title: `🚫 ${error.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🩺 MedPrompt + HIUI</h2>

      <Upload
        accept=".dcm"
        onChange={f => setFile(f[0]?.originFileObj)}
        style={{ marginBottom: 16 }}
      />

      <Input
        placeholder="Describe your prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Button
        type="primary"
        onClick={analyze}
        loading={loading}
      >
        🔍 Analyze File
      </Button>

      {response && (
        <div style={{ marginTop: 32 }}>
          <p><b>📝 Findings:</b> {response.findings}</p>
          <p><b>📊 Confidence:</b> {response.ai_confidence}</p>
          {response.image_preview_base64 && (
            <img
              src={`data:image/png;base64,${response.image_preview_base64}`}
              alt="AI Preview"
              style={{ marginTop: 16, maxWidth: '100%' }}
            />
          )}
        </div>
      )}
    </div>
  )
}

