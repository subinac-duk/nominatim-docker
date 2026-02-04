export function getVillageName(props: any) {
  return props?.NAME || null;
}

export function getTalukName(props: any) {
    props?.SUB_DIST !== props?.DISTRICT ? props?.SUB_DIST : null;
}

export function getDistrictName(props: any) {
  return props?.DISTRICT || null;
}

export function getStateName(props: any) {
  return props?.STATE || null;
}
