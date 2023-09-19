function Svgtext({text}) {
  return (
    <img width="50px" height="50px" alt="" src={`data:image/svg+xml;utf8,<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="font: 8px sans-serif;">${text}</text></svg>`} />
  );
}

export default Svgtext;
