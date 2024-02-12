/* eslint-disable typescript-sort-keys/interface */
import Nullstack, { NullstackClientContext, NullstackNode } from "nullstack";

import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import dayjs, { Dayjs } from "dayjs";
import { BaseProps } from "lib/types";

import InputWrapper from "./InputWrapper";
import tc from "../../tc";
import Button from "../Button";
import CalendarIcon from "../icons/CalendarIcon";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import ClockIcon from "../icons/ClockIcon";

const MAP_DAY_WEEK = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

type Week = {
  fri: Dayjs | null;
  mon: Dayjs | null;
  sat: Dayjs | null;
  wed: Dayjs | null;
  thu: Dayjs | null;
  sun: Dayjs | null;
  tue: Dayjs | null;
};

type DatePickerContext<T = unknown> = T & {
  bind?: { object?: any; property?: string | number };
};

interface DateTimePickerProps extends BaseProps {
  corner?: string;
  disabled?: boolean;
  error?: string;
  format?: string;
  helper?: string;
  name?: string;
  required?: boolean;
  type?: string;
  label?: string;
  buttons?: NullstackNode;
}

export const baseDateTimePicker = {
  base: "grow w-full rounded-md py-1.5 border-slate-300 shadow-sm placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0",
  variants: {
    error: {
      true: "!border-danger-300 text-danger-900 placeholder-danger-300",
    },
  },
  modal: {
    base: "modal-transition fixed z-30 inset-0 overflow-y-auto hidden modal-base ",
    variants: {
      visible: {
        true: "block",
      },
    },
    slots: {
      overlay: "fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity slots-overlay",
      wrapper: "flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center",
      content:
        "relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full",
      close: "absolute top-4 right-4",
      closeButton: "hidden",
      closeButtonIcon: "",
    },
  },
};

type DateTime = Date | string;

class DateTimePicker extends Nullstack<DateTimePickerProps> {
  openModal = false;
  currentDate: DateTime;
  inputValue = "";
  inputError = "";
  isShowTime = false;
  _targetRef;
  _dropdownRef: HTMLDivElement;
  _arrowRef;
  isNull = false;
  hydrate() {
    const customParseFormat = require("dayjs/plugin/customParseFormat");
    dayjs.extend(customParseFormat);
    this.updatePosition({});
    require("dayjs/locale/pt-br");
    dayjs.locale("pt-br");
    globalThis.window.addEventListener("click", this._handleClick);
  }

  terminate() {
    delete require.cache[require.resolve("dayjs/plugin/customParseFormat")];
    globalThis.window.removeEventListener("click", this._handleClick);
  }
  increaseHour() {
    this.setDate({ date: this.getDate({}).add(1, "hour") });
  }
  decreaseHour() {
    this.setDate({ date: this.getDate({}).subtract(1, "hour") });
  }
  increaseMinute() {
    this.setDate({ date: this.getDate({}).add(5, "minute") });
  }
  decreaseMinute() {
    this.setDate({ date: this.getDate({}).subtract(5, "minute") });
  }
  nextMonth() {
    this.setDate({ date: this.getDate({}).add(1, "M") });
  }

  prevMonth() {
    this.setDate({ date: this.getDate({}).subtract(1, "M") });
  }

  nextYear() {
    this.setDate({ date: this.getDate({}).add(1, "y") });
  }

  prevYear() {
    this.setDate({ date: this.getDate({}).subtract(1, "y") });
  }

  getDate({ bind }: DatePickerContext): Dayjs {
    if (bind.object[bind.property] === null) {
      this.isNull = true;
      return dayjs();
    }
    if (
      !(bind.object[bind.property] instanceof Date) &&
      !dayjs.isDayjs(bind.object[bind.property])
    ) {
      throw new Error(
        "[DateTimePicker] Type must be Date type or dayjs type but found " +
          bind.object[bind.property]
      );
    }
    return dayjs(bind.object[bind.property]);
  }

  getFormatedDate({ format = "DD/MM/YYYY" }) {
    if (this.isNull) return "";
    return this.getDate({}).format(format);
  }

  getHours() {
    return this.getDate({}).format("HH");
  }

  getMinutes() {
    return this.getDate({}).format("mm");
  }

  getCurrentYear() {
    const date = this.getDate({});
    return date.format("YYYY");
  }

  getCurrentMonth() {
    const date = this.getDate({});
    return date.format("MMMM");
  }

  setToday() {
    this.setDate({ date: dayjs() });
  }

  update({ bind }: NullstackClientContext<DateTimePickerProps>) {
    if (bind.object[bind.property] === null && !this.isNull) {
      this.inputValue = "";
      this.isNull = true;
    } else if (bind.object[bind.property]) {
      this.isNull = false;
      this.inputValue = this.getFormatedDate({});
    }
  }

  setDate({ bind, date, onSelect }: DatePickerContext<{ date?: Dayjs; onSelect?: () => void }>) {
    if (date === null) {
      this.isNull = true;
      bind.object[bind.property] = null;
      this.inputValue = "";
      if (typeof onSelect === "function") onSelect();
      return;
    }
    if (this.isNull) this.isNull = false;
    if (dayjs.isDayjs(date)) {
      if (dayjs.isDayjs(bind.object[bind.property])) {
        bind.object[bind.property] = date;
      } else {
        bind.object[bind.property] = date.toDate();
      }
      this.inputValue = this.getFormatedDate({});
    }
    if (typeof onSelect === "function") onSelect();
  }

  getDayFormated() {
    const date = this.getDate({});
    return date.format("ddd, DD MMMM");
  }

  getWeekShort() {
    const { format } = new Intl.DateTimeFormat(dayjs.locale(), { weekday: "short" });
    return Array.from(Array(7).keys()).map((day) => format(new Date(Date.UTC(2021, 5, day))));
  }

  getCalendar() {
    const date = this.getDate({});
    const days = date.daysInMonth();
    const month = date.month();
    const year = date.year();
    const calendar: Week[] = [];
    Array.from(Array(days).keys()).forEach((dayMinusOne) => {
      const day = dayMinusOne + 1;
      const today = dayjs(new Date(year, month, day));
      const dayOfWeek = MAP_DAY_WEEK[today.day()];
      if (dayOfWeek === "sun" || calendar.length === 0) {
        calendar.push({
          sun: null,
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
        });
      }
      const week = calendar.length - 1;
      calendar[week][dayOfWeek] = today;
    });

    return calendar;
  }

  getValueInput() {
    return this.getFormatedDate({});
  }

  handleInput(context) {
    const { event, format = "DD/MM/YYYY" } = context;
    const value = event.target.value;
    const SEPARATORS = "-_:.,()/ ".split("");
    if (value === "" || value === null) {
      this.setDate({ date: null });
    }

    if (SEPARATORS.includes(format[value.length]))
      this.inputValue = `${value}${format[value.length]}`;

    if (dayjs(value, format, true).isValid()) {
      this.isNull = false;
      this.setDate({ date: dayjs(value, format, true) });
      this.inputError = "";
    } else {
      // if (value.length === format.length) {
      this.inputError = `Data Inválida, formato esperado ${format}`;
      // }
    }
  }

  toogleShowTime() {
    this.isShowTime = !this.isShowTime;
  }

  updatePosition(context) {
    if (!this.hydrated) return;
    computePosition(this._targetRef, this._dropdownRef, {
      placement: context.placement || "top",
      middleware: [
        offset(context.offset || 4),
        flip(),
        shift(),
        arrow({ element: this._arrowRef }),
      ],
    }).then(({ middlewareData, placement, x, y }) => {
      Object.assign(this._dropdownRef.style, {
        left: `${x}px`,
        top: `${y}px`,
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

  toggleCalendar() {
    this.updatePosition({});
    this.openModal = !this.openModal;
    // if (!this.openModal) {
    autoUpdate(this._targetRef, this._dropdownRef, () => this.updatePosition({}));
    // }
  }

  _handleClick(e) {
    e.preventDefault();
    if (!this._dropdownRef) return;
    if (!this._dropdownRef.contains(e.target) && this._dropdownRef.classList.contains("block")) {
      this.updatePosition({});
      this.openModal = false;
      autoUpdate(this._targetRef, this._dropdownRef, () => this.updatePosition({}));
    }
  }

  render(context: NullstackClientContext<DateTimePickerProps>) {
    const {
      bind,
      buttons,
      class: klass,
      corner,
      disabled,
      error,
      helper,
      id,
      label,
      required,
      theme,
      type = "text",
      value,
      ...rest
    } = context;
    if (!this.hydrated) return false;
    const input = tc(baseDateTimePicker, theme?.input);
    this.getCurrentMonth();
    return (
      <InputWrapper
        id={id}
        label={label}
        error={`${error || ""}${this.inputError}`}
        helper={helper}
        corner={corner}
        required={required}
        class={` ${klass}`}
        theme={theme}
      >
        <div class="relative flex" ref={this._targetRef}>
          <input
            id={id}
            type="text"
            value={this.inputValue}
            oninput={this.handleInput}
            class={`${input({ error: !!error })}`}
            disabled={disabled}
            required={required}
            {...rest}
          />
          <button class="absolute h-full right-0 pr-4" onclick={this.toggleCalendar}>
            <CalendarIcon class={"h-4 w-4"} />
          </button>
        </div>
        <div
          class={`absolute bg-white z-[100] rounded-lg border shadow-xl ${
            this.openModal ? "block" : "hidden"
          }`}
          ref={this._dropdownRef}
        >
          <div ref={this._arrowRef} class={"absolute bg-inherit w-0 h-0 rotate-45 -z-10"} />
          <div class="bg-primary-500 p-4 ">
            <span class="font-semibold text-primary-700">{this.getCurrentYear()}</span>
            <div class="flex flex-row justify-between align-middle text-center items-center text-white">
              <span class="text-2xl font-semibold">{this.getDayFormated()}</span>
              <button
                class="transition-all ease-in-out duration-100 p-2 rounded-full hover:bg-primary-600"
                onclick={this.setToday}
              >
                <CalendarIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            class="flex justify-center bg-primary-200 p-1 hover:bg-primary-300 cursor-pointer"
            onclick={this.toogleShowTime}
          >
            {!this.isShowTime && <ClockIcon class="h-4" />}
            {this.isShowTime && <CalendarIcon class="h-4" />}
          </div>

          <div class={`overflow-hidden ${this.isShowTime ? "p-4 h-full" : "p-0 h-0"}  `}>
            <div class={`flex justify-center items-center`}>
              <div class="flex flex-col text-center ">
                <button class="p-2 hover:bg-primary-300 rounded-full" onclick={this.increaseHour}>
                  <ChevronLeftIcon class="rotate-90" />
                </button>
                <span class="text-lg">{this.getHours()}</span>
                <button class="p-2 hover:bg-primary-300 rounded-full" onclick={this.decreaseHour}>
                  <ChevronLeftIcon class="-rotate-90" />
                </button>
              </div>
              <span class="text-lg">:</span>
              <div class="flex flex-col text-center ">
                <button class="p-2 hover:bg-primary-300 rounded-full" onclick={this.increaseMinute}>
                  <ChevronLeftIcon class="rotate-90" />
                </button>
                <span class="text-lg">{this.getMinutes()}</span>
                <button class="p-2 hover:bg-primary-300 rounded-full" onclick={this.decreaseMinute}>
                  <ChevronLeftIcon class="-rotate-90" />
                </button>
              </div>
            </div>
          </div>

          <div class={`overflow-hidden ${this.isShowTime ? "p-0 h-0" : "px-2 pt-2 h-full"}  `}>
            <div class="flex justify-between">
              <div class="flex gap-2 text-center align-middle">
                <button class="p-2 hover:bg-gray-300 rounded-full" onclick={this.prevMonth}>
                  <ChevronLeftIcon class="h-4 w-4" />
                </button>
                {this.getCurrentMonth()}
                <button class="p-2 hover:bg-gray-300 rounded-full" onclick={this.nextMonth}>
                  <ChevronRightIcon class="h-4 w-4" />
                </button>
              </div>
              <div class="flex gap-2 text-center align-middle">
                <button class="p-2 hover:bg-gray-300 rounded-full" onclick={this.prevYear}>
                  <ChevronLeftIcon class="h-4 w-4" />
                </button>
                {this.getCurrentYear()}
                <button class="p-2 hover:bg-gray-300 rounded-full" onclick={this.nextYear}>
                  <ChevronRightIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="p-2">
              <div class="grid grid-cols-7 text-center">
                {this.getWeekShort().map((weekday) => (
                  <div class="font-semibold">{weekday.replace(".", "")}</div>
                ))}
                {this.getCalendar().map((week) => {
                  return (
                    <>
                      <div
                        onclick={() => this.setDate({ date: week.sun })}
                        class={`${
                          this.getDate({}).isSame(week.sun, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.sun?.get("D")}
                      </div>
                      <div
                        onclick={() => this.setDate({ date: week.mon })}
                        class={`${
                          this.getDate({}).isSame(week.mon, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.mon?.get("D")}
                      </div>
                      <div
                        onclick={() => this.setDate({ date: week.tue })}
                        class={`${
                          this.getDate({}).isSame(week.tue, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.tue?.get("D")}
                      </div>
                      <div
                        onclick={() => this.setDate({ date: week.wed })}
                        class={`${
                          this.getDate({}).isSame(week.wed, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.wed?.get("D")}
                      </div>
                      <div
                        onclick={() => this.setDate({ date: week.thu })}
                        class={`${
                          this.getDate({}).isSame(week.thu, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.thu?.get("D")}
                      </div>
                      <div
                        onclick={() => this.setDate({ date: week.fri })}
                        class={`${
                          this.getDate({}).isSame(week.fri, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.fri?.get("D")}
                      </div>
                      <div
                        onclick={() => this.setDate({ date: week.sat })}
                        class={`${
                          this.getDate({}).isSame(week.sat, "day") ? "bg-primary-200" : ""
                        } rounded-full hover:bg-primary-100 cursor-pointer`}
                      >
                        {week.sat?.get("D")}
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <footer class="flex justify-end gap-4 p-2">
            {buttons}
            <Button
              onclick={() => {
                this.openModal = !this.openModal;
              }}
            >
              Ok
            </Button>
          </footer>
        </div>
      </InputWrapper>
    );
  }
}

export default DateTimePicker;
