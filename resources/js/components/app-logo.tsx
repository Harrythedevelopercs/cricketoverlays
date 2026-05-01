import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="https://www.clubcricketofchicago.com/_next/image?url=%2Fimages%2Flogo.png&w=256&q=75" alt="Logo" className="size-5 rounded-md" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                   CCC Overlays
                </span>
            </div>
        </>
    );
}
