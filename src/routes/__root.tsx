import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import MediaPlayer from '@components/mediaPlayer/MediaPlayer'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
	  <MediaPlayer />
      <TanStackRouterDevtools position="top-right" />
    </>
  )
}
