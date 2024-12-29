import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { Moon, Sun } from 'react-bootstrap-icons';
import { toggleTheme } from "../features/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <Button
      variant={theme}
      onClick={() => dispatch(toggleTheme())}
      style={{
        borderRadius: '50%',
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem',
        color: 'gray',
      }}
    >
      {theme === 'light' ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </Button>
  );
};

export default ThemeToggle;
