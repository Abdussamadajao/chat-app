/// <reference types="nativewind/types" />
/// <reference types="react-scripts" />
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
