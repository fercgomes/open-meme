import React from "react";
import { Header, Box } from "grommet";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/types";

const GeomemeHeader = styled.p`
  text-align: center;
  font-family: "Bungee", cursive;
  font-size: 32px;
  color: white;
  margin: 0;
`;

const HeaderLink = styled(Link)`
  font-family: "Bungee", cursive;
  color: #ccc;
  text-decoration: none;
  padding: 0 5px;
  &:hover {
    color: #fff;
  }
`;

const Navbar: React.FC = () => {
  const isAuth = useSelector((state: RootState) => state.auth.authenticated);

  return (
    <div>
      <Header background="dark-1" justify="evenly" pad="none">
        <Box flex direction="row" justify="end">
          <HeaderLink to="/">Feed</HeaderLink>
        </Box>
        <Box flex direction="row" justify="end"></Box>
        <Box flex direction="row" justify="center">
          <GeomemeHeader>abmemes.org</GeomemeHeader>
        </Box>
        <Box flex direction="row" justify="end">
          {isAuth ? <HeaderLink to="/new-post">New Post</HeaderLink> : null}
        </Box>
        <Box flex direction="row" justify="start">
          {isAuth ? (
            <HeaderLink to="/">My Account</HeaderLink>
          ) : (
            <HeaderLink to="/auth/signin">Sign In</HeaderLink>
          )}
        </Box>
      </Header>
    </div>
  );
};

export default Navbar;
