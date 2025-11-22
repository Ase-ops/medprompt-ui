import React, { useState } from 'react'
import { Button, Upload, Input, Notification } from '@hi-ui/hiui'

export default function App() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const backendUrl = "https://medprompt-backend.onrender.com/analyze"

  const beforeUpload = (file) => {
    const isDicom = file.name.toLowerCase().endsWith('.dcm')
    if (!isDicom) {
      Notification.open({
        title: '⛔ Only DICOM files are allowed (.dcm)',
        type: 'error'
      })
    }
    return isDicom
  }

  async function analyze() {
    if (!file || !prompt) {
      Notification.open({ title: '⚠️ Please upload a file and enter a prompt', type: 'warning' })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("dicom_file", file)
      formData.append("prompt", prompt)

      const res = await fetch(backendUrl, {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)

      Notification.open({ title: '✅ Analysis complete', type: 'success' })
    } catch (err) {
      Notification.open({ title: '❌ Failed to analyze file', content: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>🩺 MedPrompt + HIUI</h2>

      <Upload
        accept=".dcm"
        beforeUpload={beforeUpload}
        onChange={f => setFile(f[0].originFileObj)}
      />

      <Input
        placeholder="Describe your prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        style={{ marginTop: 16 }}
      />

      <Button
        type="primary"
        onClick={analyze}
        loading={loading}
        style={{ marginTop: 16 }}
      >
        🔍 Analyze
      </Button>

      {response && (
        <div style={{ marginTop: 32 }}>
          <p><b>🧠 Findings:</b> {response.findings}</p>
          <p><b>👤 Patient:</b> {response.patient}</p>
          <p><b>📅 Study Date:</b> {response.study_date}</p>
          <p><b>🧪 Modality:</b> {response.modality}</p>
          <p><b>📈 Confidence:</b> {response.ai_confidence}</p>
          {response.image_preview_base64 && (
            <img
              src={`data:image/png;base64,${response.image_preview_base64}`}
              alt="Preview"
              style={{ marginTop: 16, maxWidth: '100%' }}
            />
          )}
        </div>
      )}
    </div>
  )
}
