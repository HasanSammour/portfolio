import { skillIcons } from '../data'

// One infinite row of tech icons. The list is doubled so the -50% shift loops seamlessly.
export default function Marquee() {
  const list = [...skillIcons, ...skillIcons]
  return (
    <div className="marquee" aria-label="Technologies I work with">
      <div className="marquee-track">
        {list.map(([Icon, name, color], i) => (
          <span className="mq-item" key={name + i} style={{ '--c': color }} aria-hidden={i >= skillIcons.length}>
            <span className="mq-icon"><Icon size={26} /></span><em>{name}</em>
          </span>
        ))}
      </div>
    </div>
  )
}
