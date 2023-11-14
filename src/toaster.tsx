import { createRoot } from 'react-dom/client'
import { OverlayToaster, Toaster } from '@blueprintjs/core'
// Because OverlayToaster.create() uses ReactDOM.render, we have to render the Toaster ourselves
export let appToaster: Toaster

createRoot(document.getElementById('toaster')!).render(
  <OverlayToaster
    maxToasts={5}
    ref={(instance) => {
      appToaster = instance!
    }}
  />,
)
