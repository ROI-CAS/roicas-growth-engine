import "react";
declare module "react" {
  interface HTMLAttributes<T> {
    /** React 18 forwards the empty string as a boolean HTML attribute. */
    inert?: "";
  }
}
