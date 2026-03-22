'use client'
import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  label?: string
}
interface State { hasError: boolean; message: string }

export default class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? ` — ${this.props.label}` : ''}]`, error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const C = {
        border: 'rgba(255,255,255,0.07)',
        textD: 'rgba(184,184,184,0.45)',
        textDD: 'rgba(184,184,184,0.2)',
      }

      return (
        <div
          style={{
            padding: '18px 16px',
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: C.textD }}>
            Não foi possível carregar esta seção.
          </span>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              color: C.textDD,
              background: 'none',
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}