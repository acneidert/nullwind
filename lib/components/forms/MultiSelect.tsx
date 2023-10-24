/* eslint-disable unused-imports/no-unused-vars */
import Nullstack, { NullstackClientContext, NullstackNode } from "nullstack";

import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";

import InputWrapper from "./InputWrapper";
import tc from "../../tc";
import type { BaseProps } from "../../types";
import ChevronSort from "../icons/ChevronSort";

export const baseSelect = {
  base: "w-full py-1.5 rounded-md border-slate-300 shadow-sm disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0",
  variants: {
    error: {
      true: "!border-danger-300 text-danger-900 placeholder-danger-300",
    },
  },
};
type optionsProps = {
  bind?: { object: unknown; property: string };
  children?: { attributes: { value }; children }[];
  options?: { text: unknown; value: unknown }[];
};
interface MultiSelectProps extends BaseProps {
  children?: NullstackNode;
  corner?: string;
  disabled?: boolean;
  error?: string;
  helper?: string;
  label?: string;
  options?: Array<unknown>;
  required?: boolean;
  single?: boolean;
  template?: (option?: unknown) => NullstackNode;
}

class MultiSelect extends Nullstack<MultiSelectProps> {
  _selected = [];
  _options: HTMLUListElement;
  _targetRef: HTMLDivElement;
  _arrowRef: HTMLDivElement;
  filter = "";
  openDropdown = false;

  hydrate() {
    globalThis.window.addEventListener("click", this._handleClick);
  }

  terminate() {
    globalThis.window.removeEventListener("click", this._handleClick);
  }

  _handleClick(e) {
    e.preventDefault();
    if (
      !this._options.contains(e.target) &&
      !this._targetRef.contains(e.target) &&
      this.openDropdown
    ) {
      this.updatePosition({});
      this.openDropdown = false;
      autoUpdate(this._targetRef, this._options, () => this.updatePosition({}));
    }
  }

  _getFilter(option) {
    if (this.filter === "") return true;
    return option.text.toLowerCase().includes(this.filter.toLowerCase());
  }

  updatePosition(context) {
    computePosition(this._targetRef, this._options, {
      placement: context.placement || "bottom",
      middleware: [
        offset(context.offset || 4),
        flip(),
        shift(),
        arrow({ element: this._arrowRef }),
      ],
    }).then(({ middlewareData, placement, x, y }) => {
      Object.assign(this._options.style, {
        left: `${x}px`,
        top: `${y}px`,
        width: `${this._targetRef.clientWidth}px`,
      });

      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[placement.split("-")[0]];

      Object.assign(this._arrowRef.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        right: "",
        bottom: "",
        [staticSide]: "-4px",
      });
    });
  }

  getOptions({ bind, children, options }: optionsProps) {
    const newOptions = [];
    if (children) {
      children.forEach(({ attributes: { value }, children, ...rest }) => {
        const isSelected =
          (bind.object[bind.property] || []).findIndex((sel) => sel.value === value) > -1;
        newOptions.push({ value, text: children.join(""), selected: isSelected, ...rest });
      });
    }
    if (options) {
      options.forEach((option) => {
        const isSelected =
          (bind.object[bind.property] || []).findIndex((sel) => sel.value === option.value) > -1;
        newOptions.push({ ...option, selected: isSelected });
      });
    }
    return newOptions.filter(this._getFilter);
  }

  setSelected({ bind, data, single = false }) {
    if (!bind.object[bind.property]) {
      bind.object[bind.property] = [];
    }

    if (single) bind.object[bind.property] = [];

    const isSelected = bind.object[bind.property].findIndex((sel) => sel.value === data.value);
    if (isSelected > -1) {
      bind.object[bind.property].splice(isSelected, 1);
    } else {
      const option = this.getOptions({}).find((opt) => opt.value === data.value);
      bind.object[bind.property].push(option);
    }
    this._targetRef.querySelector("input").focus();
  }

  toggleDropdown() {
    console.log("toggle");
    this.updatePosition({});
    this.openDropdown = true;
    autoUpdate(this._targetRef, this._options, () => this.updatePosition({}));
  }

  render({
    bind,
    children,
    class: klass,
    corner,
    disabled,
    error,
    helper,
    id,
    label,
    options,
    required,
    template,
    theme,
    ...rest
  }: NullstackClientContext<MultiSelectProps>) {
    const select = tc(baseSelect, theme?.select);
    const opts = this.getOptions({});
    return (
      <InputWrapper
        id={id}
        label={label}
        error={error}
        helper={helper}
        corner={corner}
        required={required}
        class={klass}
        theme={theme}
      >
        <div
          class="relative flex gap-2 p-1 rounded-md focus-within:border-primary-300 focus-within:ring focus-within:ring-primary-200 focus-within:ring-opacity-50 focus-within:ring-offset-0 border"
          ref={this._targetRef}
        >
          {(bind.object[bind.property] || []).map((sel) => {
            return (
              <span class="flex pl-2 gap-1 rounded-lg bg-zinc-200 text-center align-middle justify-center items-center flex-nowrap whitespace-nowrap">
                {sel.text}
                <span
                  class="hover:bg-zinc-300 px-1.5 cursor-pointer rounded-lg"
                  data-value={sel.value}
                  onclick={this.setSelected}
                >
                  X
                </span>
              </span>
            );
          })}
          <input
            id={id}
            bind={this.filter}
            onfocus={this.toggleDropdown}
            disabled={disabled}
            class="shadow-none max-w-sm shrink ring-0 border-0 focus:shadow-none p-1 focus:ring-0 focus:border-0 focus:outline-none"
            required={required}
            {...rest}
          />
          <span class="absolute h-full right-0 top-0 pr-4 flex items-center">
            <ChevronSort class="h-4 w-4 text-gray-800" />
          </span>
        </div>
        <ul
          class={`absolute w-[100%] bg-white flex flex-col gap-1 border p-2 rounded-lg z-[900] ${
            this.openDropdown ? "block" : "hidden"
          }`}
          ref={this._options}
        >
          <div ref={this._arrowRef} class={"absolute bg-inherit w-0 h-0 rotate-45 -z-10"} />
          {opts.findIndex((opt) => !opt.selected) === -1 && <li>Não há mais itens</li>}
          {opts.length > 0 &&
            opts.map((option) => {
              return (
                <li
                  data-value={option.value}
                  class={`${
                    option.selected ? "hidden" : ""
                  } hover:bg-zinc-100 px-2 rounded-lg cursor-pointer`}
                  onclick={this.setSelected}
                >
                  {typeof template === "function" && template(option)}
                  {typeof template !== "function" && option.text}
                </li>
              );
            })}
        </ul>
      </InputWrapper>
    );
  }
}

export default MultiSelect;
