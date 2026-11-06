import { motion } from 'framer-motion'

// Shared animated tab bar. Label sits above the sliding pill, so it is always visible.
export default function Tabs({ items, value, onChange, id, className = '' }) {
  return (
    <div className={'tabs ' + className} role="tablist">
      {items.map((it) => {
        const on = value === it.id
        return (
          <button key={it.id} role="tab" aria-selected={on} className={on ? 'tab on' : 'tab'} onClick={() => onChange(it.id)}>
            {on && <motion.span layoutId={'pill-' + id} className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="tab-label">{it.label}{it.count != null && <small>{it.count}</small>}</span>
          </button>
        )
      })}
    </div>
  )
}
