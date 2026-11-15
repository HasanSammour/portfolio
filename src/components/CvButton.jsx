import { FiDownload } from 'react-icons/fi'
import { useLang } from '../context/LangContext'
import { profile } from '../data'

// One component, used in the navbar, hero, about section and footer.
export default function CvButton({ className = 'btn btn-ghost', label = 'download' }) {
  const { t, u } = useLang()
  return (
    <a className={className} href={t(profile.cv)} download="Hasan-Sammour-CV.pdf">
      <FiDownload aria-hidden />{u.cv[label]}
    </a>
  )
}
