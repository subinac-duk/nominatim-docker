export function getVillageName(props: any) {
  // village.json → NAME
  return props?.NAME || null;
}

export function getTalukName(props: any) {
  // taluk.json → TALUK
  return props?.TALUK || null;
}

export function getDistrictName(props: any) {
  // district.json → DISTRICT
  return props?.DISTRICT || null;
}

export function getStateName(props: any) {
  // all files → STATE
  return props?.ST_NM || null;
}
