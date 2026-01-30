export function getFeatureName(props: any) {
  return (
    props?.VILLAGE ||
    props?.VILL_NAME ||
    props?.village ||
    props?.TALUK ||
    props?.TALUK_NAME ||
    props?.taluk ||
    props?.DISTRICT ||
    props?.DIST_NAME ||
    props?.district ||
    props?.STATE ||
    props?.STATE_NAME ||
    props?.state ||
    null
  );
}
