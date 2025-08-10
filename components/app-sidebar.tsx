import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// MTK Care Help navigation data
const data = {
  versions: ["v1.0.0", "v1.1.0-beta", "v2.0.0-alpha"],
  navMain: [
    {
      title: "Patient Care",
      url: "#",
      items: [
        {
          title: "Emergency Contacts",
          url: "#",
        },
        {
          title: "Medical Records",
          url: "#",
        },
        {
          title: "Appointments",
          url: "#",
        },
        {
          title: "Medication Tracker",
          url: "#",
        },
      ],
    },
    {
      title: "Health Resources",
      url: "#",
      items: [
        {
          title: "Health Guidelines",
          url: "#",
        },
        {
          title: "Symptom Checker",
          url: "#",
        },
        {
          title: "First Aid Guide",
          url: "#",
        },
        {
          title: "Wellness Tips",
          url: "#",
        },
        {
          title: "Nutrition Guide",
          url: "#",
        },
        {
          title: "Exercise Plans",
          url: "#",
        },
      ],
    },
    {
      title: "Support Services",
      url: "#",
      items: [
        {
          title: "Telehealth",
          url: "#",
        },
        {
          title: "Care Coordination",
          url: "#",
        },
        {
          title: "Insurance Help",
          url: "#",
        },
        {
          title: "Pharmacy Services",
          url: "#",
        },
        {
          title: "Mental Health",
          url: "#",
        },
      ],
    },
    {
      title: "Account & Settings",
      url: "#",
      items: [
        {
          title: "Profile Settings",
          url: "#",
        },
        {
          title: "Privacy Settings",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Help & Support",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <a href={subItem.url}>{subItem.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
