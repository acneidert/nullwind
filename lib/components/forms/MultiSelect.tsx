/* eslint-disable unused-imports/no-unused-vars */
import Nullstack, { NullstackClientContext, NullstackNode } from "nullstack";

import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";

import Checkbox from "./Checkbox";
import InputWrapper from "./InputWrapper";
import tc from "../../tc";
import { type BaseProps } from "../../types";
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
  onFilter?: ({ filter }: { filter: string }) => Array<unknown>;
  options?: { text: unknown; value: unknown }[];
};
interface MultiSelectProps extends BaseProps {
  children?: NullstackNode;
  corner?: string;
  disabled?: boolean;
  error?: string;
  helper?: string;
  label?: string;
  onFilter?: ({ filter }: { filter: string }) => Promise<Array<unknown>>;
  onSelect?: () => void;
  options?: Array<unknown>;
  required?: boolean;
  single?: boolean;
  template?: (option?: unknown) => NullstackNode;
}

class MultiSelect extends Nullstack<MultiSelectProps> {
  _selected = [];
  _optionsEl: HTMLUListElement;
  _targetRef: HTMLDivElement;
  _arrowRef: HTMLDivElement;
  filter = "";
  _options = [];
  openDropdown = false;
  loading = false;
  async hydrate() {
    globalThis.window.addEventListener("click", this._handleClick);
    await this.getOptions({});
  }

  terminate() {
    globalThis.window.removeEventListener("click", this._handleClick);
  }

  _handleClick(e) {
    // e.preventDefault();
    if (
      !this._optionsEl.contains(e.target) &&
      !this._targetRef.contains(e.target) &&
      this.openDropdown
    ) {
      this.updatePosition({});
      this.openDropdown = false;
      autoUpdate(this._targetRef, this._optionsEl, () => this.updatePosition({}));
      this.filter = "";
    }
  }

  _getFilter(option) {
    if (this.filter === "") return true;
    return option.text.toLowerCase().includes(this.filter.toLowerCase());
  }

  updatePosition(context) {
    computePosition(this._targetRef, this._optionsEl, {
      placement: context.placement || "bottom",
      middleware: [
        offset(context.offset || 4),
        flip(),
        shift(),
        arrow({ element: this._arrowRef }),
      ],
    }).then(({ middlewareData, placement, x, y }) => {
      Object.assign(this._optionsEl.style, {
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

  async getOptions({ bind, children, onFilter = undefined, options }: optionsProps) {
    this.loading = true;
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
    if (onFilter && typeof onFilter === "function") {
      this._options = await onFilter({ filter: this.filter });
    } else {
      this._options = newOptions.filter(this._getFilter);
    }
    this.loading = false;
  }

  async setSelected({ bind, data, onSelect, single = false }) {
    this._targetRef.querySelector("input").focus();
    if (!bind.object[bind.property]) {
      bind.object[bind.property] = [];
    }

    const isSelected = bind.object[bind.property].findIndex((sel) => sel.value === data.value);
    if (isSelected > -1) {
      const opt = bind.object[bind.property][isSelected];
      const findedOption = this._options.find(({ value }) => value === opt.value);
      if (findedOption) findedOption.selected = false;
      bind.object[bind.property].splice(isSelected, 1);
    } else {
      if (single) {
        this._options = this._options.map(({ selected, ...rest }) => ({
          ...rest,
          selected: false,
        }));
        bind.object[bind.property] = [];
      }
      const option = this._options.find((opt) => opt.value === data.value);
      option.selected = true;
      bind.object[bind.property].push(option);
    }
    if (typeof onSelect === "function") onSelect();

    setTimeout(() => {
      this._targetRef.querySelector("input").focus();
    }, 50);
  }

  toggleDropdown() {
    if (this.openDropdown) return;
    this.updatePosition({});
    this.openDropdown = true;
    autoUpdate(this._targetRef, this._optionsEl, () => this.updatePosition({}));
    this.getOptions({});
  }

  async handleChange() {
    await this.getOptions({});
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
    onFilter,
    options,
    required,
    single,
    template,
    theme,
    ...rest
  }: NullstackClientContext<MultiSelectProps>) {
    const select = tc(baseSelect, theme?.select);
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
        <>
          <div
            class={`relative flex gap-2 p-1 rounded-md border ${
              this.openDropdown
                ? `border-primary-300 ring ring-primary-200 ring-opacity-50 ring-offset-0 `
                : ""
            } ${disabled ? "cursor-not-allowed border-zinc-300" : ""}`}
            ref={this._targetRef}
          >
            {single &&
              (bind.object[bind.property] || []).map((sel) => {
                if (disabled)
                  return (
                    <span class="cursor-not-allowed flex px-2 gap-1 rounded-lg bg-zinc-100 text-zinc-400 text-center align-middle justify-center items-center flex-nowrap whitespace-nowrap">
                      {sel.text}
                    </span>
                  );

                return (
                  <span class="flex pl-2 gap-1 rounded-lg bg-zinc-200 text-center align-middle justify-center items-center flex-nowrap whitespace-nowrap">
                    <span class="truncate max-w-[8rem]">{sel.text}</span>
                    {!disabled && (
                      <span
                        class="hover:bg-zinc-300 px-1.5 cursor-pointer rounded-lg"
                        data-value={sel.value}
                        onclick={this.setSelected}
                      >
                        X
                      </span>
                    )}
                  </span>
                );
              })}
            {!single && (
              <span class="flex px-2 gap-1 rounded-lg bg-zinc-200 text-center align-middle justify-center items-center flex-nowrap whitespace-nowrap">
                {(bind.object[bind.property] || []).length} itens selecionados
              </span>
            )}
            <input
              id={id}
              bind={this.filter}
              oninput={this.handleChange}
              onfocus={this.toggleDropdown}
              disabled={disabled}
              class={`shadow-none min-w-12 shrink ring-0 border-0 focus:shadow-none p-1 focus:ring-0 focus:border-0 focus:outline-none ${
                disabled ? "cursor-not-allowed" : ""
              }`}
              required={required}
              {...rest}
            />
            {!disabled && (
              <span
                onclick={this.toggleDropdown}
                class="absolute h-full right-0 top-0 pr-4 flex items-center cursor-pointer"
              >
                <ChevronSort class="h-4 w-4 text-gray-800" />
              </span>
            )}
            {disabled && (
              <span class="absolute h-full right-0 top-0 pr-4 flex items-center">
                <ChevronSort class="h-4 w-4 text-gray-400" />
              </span>
            )}
          </div>
          <ul
            class={`absolute w-[100%] bg-white flex flex-col gap-1 border p-2 rounded-lg z-[900] max-h-80 overflow-auto ${
              this.openDropdown ? "block" : "hidden"
            }`}
            ref={this._optionsEl}
          >
            <div ref={this._arrowRef} class={"absolute bg-inherit w-0 h-0 rotate-45 -z-10"} />
            {this.loading && <li>Buscando...</li>}
            {!this.loading &&
              typeof onFilter !== "function" &&
              this._options.findIndex((opt) => !opt.selected) === -1 && <li>Não há mais itens</li>}
            {!this.loading &&
              typeof onFilter === "function" &&
              this._options.findIndex((opt) => !opt.selected) === -1 && (
                <li>Digite para Buscar...</li>
              )}
            {!this.loading &&
              this._options.length > 0 &&
              this._options.map((option) => {
                return (
                  <li
                    data-value={option.value}
                    class={`${
                      option.selected && single ? "hidden" : " flex gap-2 items-center"
                    } hover:bg-zinc-100 px-2 rounded-lg cursor-pointer`}
                    onclick={this.setSelected}
                  >
                    {!single && (
                      <Checkbox bind={option.selected} class="w-4 h-4 text-primary-500" />
                    )}
                    {typeof template === "function" && template(option)}
                    {typeof template !== "function" && option.text}
                  </li>
                );
              })}
          </ul>
        </>
      </InputWrapper>
    );
  }
}

export default MultiSelect;
