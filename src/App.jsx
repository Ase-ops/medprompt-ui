import React, { useState } from 'react'
import { Button, Upload, Input, Notification } from '@hi-ui/hiui'

export default function App() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState(null)

  async function analyze() {
    if (!file || !prompt.trim()) {
      Notification.open({ title: '⚠️ Please upload a file and enter a prompt', type: 'warning' })
      return
    }

    const formData = new FormData()
    formData.append("dicom_file", file)
    formData.append("prompt", prompt)

    try {
      const res = await fetch("https://medprompt-backend.onrender.com/analyze", {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        throw new Error("Failed to fetch from backend")
      }

      const data = await res.json()
      setResponse(data)

      Notification.open({ title: '✅ Analysis complete', type: 'success' })
    } catch (err) {
      console.error(err)
      Notification.open({ title: '❌ Error analyzing file', type: 'danger' })
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🩺 MedPrompt + HIUI</h2>

      <Upload
        onChange={(files) => {
          const raw = files?.[0]?.originFileObj
          if (raw) setFile(raw)
        }}
        uploadAction="#"
        style={{ marginBottom: 16 }}
      />

      <Input
        placeholder="Describe your prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Button type="primary" onClick={analyze}>
        🔍 Analyze
      </Button>

      {response && (
        <div style={{ marginTop: 32 }}>
          <p><b>🧠 Findings:</b> {response.findings}</p>
          <p><b>📊 Confidence:</b> {response.ai_confidence}</p>
          <img
            src={`data:image/png;base64,${response.image_preview_base64}`}
            alt="DICOM Preview"
            style={{ marginTop: 16, maxWidth: "100%", border: '1px solid #ddd' }}
          />
        </div>
      )}
    </div>
  )
}

