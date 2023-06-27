import { NullstackClientContext, NullstackFunctionalComponent } from "nullstack";

import Corner from "./Corner";
import Error from "./Error";
import Helper from "./Helper";
import Label from "./Label";
import type { ComponentProps } from "../../types";
import useThemeProvider from "../../useTheme";

interface InputProps extends ComponentProps {
  corner?: string;
  error?: string;
  helper?: string;
  label?: string;
  required?: boolean;
}

function Input({
  children,
  class: klass,
  corner,
  error,
  helper,
  id,
  label,
  required,
  theme,
  useTheme = useThemeProvider(),
}: NullstackClientContext<InputProps>) {
  const { base, slots } = useTheme(theme).input;

  return (
    <div class={[base, klass]}>
      <div class={slots.labelWrapper}>
        <Label required={required} for={id} theme={theme}>
          {label}
        </Label>
        {corner && <Corner theme={theme}>{corner}</Corner>}
      </div>
      {children}
      {error ? (
        <Error theme={theme}>{error}</Error>
      ) : (
        helper && <Helper theme={theme}>{helper}</Helper>
      )}
    </div>
  );
}

export default Input as NullstackFunctionalComponent<InputProps>;
