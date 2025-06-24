import { ThemeProvider } from "@/contexts/theme-context"
import { IDE } from "@/components/ide"

export default function Home() {
  return (
    <ThemeProvider>
      <IDE />
    </ThemeProvider>
  )
}
