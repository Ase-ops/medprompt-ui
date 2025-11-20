import React, { useState } from 'react'
import { Button, Upload, Input, Notification } from '@hi-ui/hiui'

export default function App() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState(null)

  async function analyze() {
    const formData = new FormData()
    formData.append("dicom_file", file)
    formData.append("prompt", prompt)

    const res = await fetch("/analyze", {
      method: "POST",
      body: formData
    })

    const data = await res.json()
    setResponse(data)
    Notification.open({ title: '✅ Analysis complete', type: 'success' })
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🩺 MedPrompt + HIUI</h2>
      <Upload onChange={f => setFile(f[0].originFileObj)} />
      <Input
        placeholder="Describe your prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ marginTop: 16 }}
      />
      <Button type="primary" onClick={analyze} style={{ marginTop: 16 }}>
        🔍 Analyze
      </Button>
      {response && (
        <div style={{ marginTop: 32 }}>
          <p><b>Findings:</b> {response.findings}</p>
          <p><b>Confidence:</b> {response.ai_confidence}</p>
          <img src={`data:image/png;base64,${response.image_preview_base64}`} alt="Preview" />
        </div>
      )}
    </div>
  )
}