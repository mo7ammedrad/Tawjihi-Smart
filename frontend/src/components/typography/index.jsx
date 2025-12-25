//style
import { Pargraph, PargType } from "./style";

export const H1 = ({ children, size = "35px", color }) => {
  return <h1 style={{ fontSize: size, color: color || `${({ theme }) => theme.color}` }}>{children}</h1>;
};

export const H2 = ({ children, color  }) => {
  return <h2 style={{ color: color }}>{children}</h2>;
};

export const H3 = ({ children, color }) => {
  return <h3 style={{ color: color }}>{children}</h3>;
};

export const H4 = ({ children }) => {
  return <h4>{children}</h4>;
};

export const H5 = ({ children }) => {
  return <h5>{children}</h5>;
};

export const H6 = ({ children }) => {
  return <h6>{children}</h6>;
};

export const Parg = ({ children, color = "#fff" }) => {
  return <PargType color={color}>{children}</PargType>;
};

export const Pargrahph = ({ children, size }) => {
  return <Pargraph size={size}>{children}</Pargraph>;
};
