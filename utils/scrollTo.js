export function scrollTo(elementRef) {
  elementRef.current?.scrollIntoView({ behavior: "smooth" });
}
