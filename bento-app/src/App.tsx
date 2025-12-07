import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl text-primary">Bento App Setup</h1>
      <p className="text-xl">This background should be Cream (#FFFDD0)</p>
      <p className="font-heading font-bold">This is Nunito Font</p>
      <Button className="bg-primary text-white rounded-3xl px-8 py-6 text-lg hover:bg-primary/90">
        Start Button (Varela Round)
      </Button>
      <Button variant="secondary" className="rounded-3xl">
        Secondary Action
      </Button>
    </div>
  )
}

export default App
