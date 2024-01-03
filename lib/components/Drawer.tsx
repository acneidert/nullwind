import Nullstack, { NullstackClientContext } from "nullstack";

import { BaseProps } from "lib/types";

import tc from "../tc";

export const baseDrawer = {
  base: "fixed inset-0 z-20 hidden",
  baseII: "test",
  variants: {
    open: {
      true: "block",
    },
  },
  slots: {
    overlay: "fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity z-30",
    content: {
      base: "absolute z-50 top-0 h-full bg-white  dark:text-white block px-2 pt-2 w-52 border-r shadow-lg dark:border-r-0 transition-transform duration-500 max-h-screen",
      variants: {
        open: {
          true: "translate-x-0",
          false: "-translate-x-full",
        },
      },
    },
  },
};

interface DrawerProps extends BaseProps {
  duration?: number;
  onclose?: () => void;
}

class Drawer extends Nullstack<DrawerProps> {
  open = false;
  openDrawer = false;

  hide({ duration = 500, onclose }) {
    this.openDrawer = false;
    setTimeout(() => {
      this.open = false;
      if (typeof onclose === "function") {
        onclose();
      }
    }, duration);
  }

  show() {
    this.open = true;
    setTimeout(() => {
      this.openDrawer = true;
    }, 50);
  }

  render({ children, class: klass, ref, theme }: NullstackClientContext<DrawerProps>) {
    const drawer = tc(baseDrawer, theme?.drawer);
    const { base, content, overlay } = drawer();
    return (
      <div class={base({ open: this.open, class: klass })}>
        <div class={overlay()} aria-hidden="true" onclick={this.hide} />
        <div ref={ref} id="side-bar" class={content({ open: this.openDrawer })}>
          {children}
        </div>
      </div>
    );
  }
}

export default Drawer;
