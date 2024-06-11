import { Button } from "@/components/ui/button"

const ButtonsPage = () =>{
    return(
        <div className="flex flex-col p-4 space-y-4 max-w-[200px]">
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="primaryOutline">PrimaryOutline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="secondaryOutline">SecondaryOutline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="dangerOutline">DangerOutline</Button>
            <Button variant="super">super</Button>
            <Button variant="superOutline">superOutline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="sidebar">Sidebar</Button>
            <Button variant="sidebarOutline">SidebarOutline</Button>
        </div>
    )
}

export default ButtonsPage