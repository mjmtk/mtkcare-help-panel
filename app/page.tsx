import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HelpTrigger } from "@/components/help-trigger"

export default function Home() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <HelpTrigger />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to MTK Care Help</h1>
            <p className="text-muted-foreground mt-2">
              Your comprehensive medical care assistance and support platform
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Access frequently used features and tools
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground mt-2">
                View your recent interactions and updates
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Help Resources</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Browse documentation and support materials
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
