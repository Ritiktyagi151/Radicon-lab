'use client'

import { Plus, Save, Trash2 } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { AdminButton, AdminPageHeader, GlassCard } from '@/components/admin/AdminPrimitives'
import { useToast } from '@/components/admin/providers/ToastProvider'
import { apiRequest } from '@/lib/admin/api'
import { useRealtimeUpdates } from '@/lib/admin/realtime'

type NavLink = {
  label: string
  href: string
}

type SiteSettings = {
  navLinks: NavLink[]
  socialLinks: Record<string, string>
  copyrightText: string
  version: string
}

const emptySettings: SiteSettings = {
  navLinks: [],
  socialLinks: {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    x: '',
  },
  copyrightText: '',
  version: '1.0.0',
}

export default function SettingsManager() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<SiteSettings>(emptySettings)

  useEffect(() => {
    apiRequest<SiteSettings>('/site-settings', { auth: false })
      .then((data) => setSettings({ ...emptySettings, ...data }))
      .catch((error) => showToast(error instanceof Error ? error.message : 'Unable to load settings', 'error'))
  }, [])

  const loadSettings = async () => {
    try {
      const data = await apiRequest<SiteSettings>('/site-settings', { auth: false })
      setSettings({ ...emptySettings, ...data })
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load settings', 'error')
    }
  }

  useRealtimeUpdates({
    resources: ['site-settings'],
    onEvent: (event) => {
      if (event.resource !== 'site-settings' || event.action === 'heartbeat') return
      showToast(event.message)
      void loadSettings()
    },
    onError: () => showToast('Realtime settings sync disconnected. Retrying automatically.', 'error'),
  })

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const updated = await apiRequest<SiteSettings>('/site-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      })
      setSettings({ ...emptySettings, ...updated })
      showToast('Nav and footer settings updated successfully')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update settings', 'error')
    }
  }

  return (
    <section>
      <AdminPageHeader
        eyebrow="Site Settings"
        title="Nav & Footer"
        description="Update navigation links, social media handles, copyright text, and admin version details dynamically."
      />

      <form onSubmit={saveSettings} className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-950">Navigation Links</h2>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, navLinks: [...settings.navLinks, { label: '', href: '' }] })}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-brand-700"
            >
              <span className="inline-flex items-center gap-2"><Plus size={16} />Add Link</span>
            </button>
          </div>
          <div className="mt-6 space-y-3">
            {settings.navLinks.map((link, index) => (
              <div key={index} className="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]">
                <Input label="Label" value={link.label} onChange={(value) => {
                  const navLinks = [...settings.navLinks]
                  navLinks[index] = { ...link, label: value }
                  setSettings({ ...settings, navLinks })
                }} />
                <Input label="Href" value={link.href} onChange={(value) => {
                  const navLinks = [...settings.navLinks]
                  navLinks[index] = { ...link, href: value }
                  setSettings({ ...settings, navLinks })
                }} />
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, navLinks: settings.navLinks.filter((_, linkIndex) => linkIndex !== index) })}
                  className="self-end rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:text-brand-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-black text-slate-950">Social Links</h2>
            <div className="mt-6 grid gap-4">
              {Object.entries(settings.socialLinks).map(([key, value]) => (
                <Input
                  key={key}
                  label={key.toUpperCase()}
                  value={value}
                  onChange={(nextValue) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [key]: nextValue } })}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-2xl font-black text-slate-950">Footer</h2>
            <div className="mt-6 grid gap-4">
              <Input label="Copyright Text" value={settings.copyrightText} onChange={(value) => setSettings({ ...settings, copyrightText: value })} />
              <Input label="Version" value={settings.version} onChange={(value) => setSettings({ ...settings, version: value })} />
            </div>
          </GlassCard>

          <AdminButton type="submit">
            <span className="inline-flex items-center gap-2">
              <Save size={17} />
              Save Settings
            </span>
          </AdminButton>
        </div>
      </form>
    </section>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-brand-300" />
    </label>
  )
}
