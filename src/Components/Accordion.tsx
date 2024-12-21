"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "../utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex dark:text-slate-200 flex-1 items-center justify-between py-2 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 hover:bg-slate-300 dark:hover:bg-slate-500  rounded-sm px-2",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className='overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

type AccordionProps = {
  title: string;
  isOpen?: boolean;
  children: React.ReactNode;
  class?: string;
  triggerClass?: string;
  contentClass?: string;
  borderBottomOff?: boolean;
};

export function AccordionComponent(props: AccordionProps) {
  return (
    <Accordion
      type='single'
      defaultValue={props.isOpen ? "item-1" : ""}
      collapsible
      className={props.class}
    >
      <AccordionItem
        value='item-1'
        className={props.borderBottomOff ? "border-b-0" : ""}
      >
        <AccordionTrigger className={props.triggerClass}>
          {props.title}
        </AccordionTrigger>
        <AccordionContent className={props.contentClass}>
          {props.children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
