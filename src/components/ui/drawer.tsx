"use client";

import { Drawer as VaulDrawer } from "vaul";
import * as React from "react";
import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Root>) => (
  <VaulDrawer.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = VaulDrawer.Trigger;

const DrawerPortal = VaulDrawer.Portal;

const DrawerClose = VaulDrawer.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Overlay>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
    {...props}
  />
));
DrawerOverlay.displayName = VaulDrawer.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Content>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Content> & { side?: "bottom" | "left" | "right" }
>(({ className, children, side = "bottom", ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <VaulDrawer.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-background outline-none",
        side === "bottom" && "inset-x-0 bottom-0 mt-24 rounded-t-[20px]",
        side === "left" && "inset-y-0 left-0 w-3/4 max-w-sm rounded-r-[20px]",
        side === "right" && "inset-y-0 right-0 w-3/4 max-w-sm rounded-l-[20px]",
        className
      )}
      {...props}
    >
      {side === "bottom" && (
        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted/40" />
      )}
      {children}
    </VaulDrawer.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
};
