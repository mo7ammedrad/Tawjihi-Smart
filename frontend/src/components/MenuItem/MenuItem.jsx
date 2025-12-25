"use client"

import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
// MUI
import { styled, alpha } from "@mui/material/styles"
import { Button, Menu, MenuItem, Divider, CircularProgress, Avatar, Typography, Box, Fade } from "@mui/material"
import {
  FavoriteBorder as FavoriteBorderIcon,
  PersonOutline as PersonOutlineIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  MenuBook as MenuBookIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material"

// Context
import { AuthContext } from "../../context/AuthContext"
import { LogOutContext } from "../../context/LogoutContext"
import { AppContext } from "../../context/WishAndCartListContext"
import { Actions } from "../../constant/ACTIONS"

// Paths
import { PATH } from "../../routes"

// Axios
import axios from "axios"

// Config
import { API_URL } from "../../config"

// Toast
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Enhanced styled menu with better animations and shadows
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    TransitionComponent={Fade}
    transitionDuration={200}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 16,
    marginTop: theme.spacing(1),
    minWidth: 240,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(10px)",
    "& .MuiMenu-list": {
      padding: "12px 8px",
    },
    "& .MuiMenuItem-root": {
      fontSize: 14,
      fontWeight: 500,
      padding: "12px 16px",
      borderRadius: 8,
      margin: "2px 0",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        color: "#666",
        marginRight: theme.spacing(1.5),
        transition: "color 0.2s ease",
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        transform: "translateX(-2px)",
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
        },
      },
      "&:active": {
        transform: "translateX(-1px)",
      },
    },
  },
}))

// Enhanced user button with better styling
const UserButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: 24,
  padding: "8px 16px",
  textTransform: "none",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "14px",
  minWidth: 120,
  maxWidth: 160,
  boxShadow: "0px 4px 12px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    boxShadow: "0px 6px 20px rgba(102, 126, 234, 0.4)",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 18,
    marginLeft: theme.spacing(0.5),
    transition: "transform 0.2s ease",
  },
}))

// User info section component
const UserInfoSection = styled(Box)(({ theme }) => ({
  padding: "16px",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}))

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const open = Boolean(anchorEl)
  const { setIsAuth } = React.useContext(AuthContext)
  const { setIsLogout } = React.useContext(LogOutContext)
  const { dispatch } = React.useContext(AppContext)
  const navigate = useNavigate()

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true })
      setIsAuth(false)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      dispatch({ type: Actions.SetWishList, payload: [] })
      dispatch({ type: Actions.SetCartList, payload: [] })
      setIsLogout(true)
      toast.success("تم تسجيل الخروج بنجاح")
      navigate(PATH.Main)
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("فشل تسجيل الخروج، حاول مرة أخرى")
    } finally {
      setLoading(false)
      handleMenuClose()
    }
  }

  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user"))
  } catch {
    user = null
  }

  const userName = user?.name?.split(" ")[0] || "المستخدم"
  const userEmail = user?.email || ""

  return (
    <div>
      <UserButton
        id="customized-button"
        aria-controls={open ? "customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        onClick={handleClick}
        sx={{
          "& .MuiSvgIcon-root": {
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          },
        }}
      >
       
        {userName}
        <KeyboardArrowDownIcon />
      </UserButton>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: { "aria-labelledby": "customized-button" },
        }}
      >
        <UserInfoSection>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              fontSize: 16,
            }}
          >
            {userName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {userName}
            </Typography>
            {userEmail && (
              <Typography variant="caption" color="text.secondary">
                {userEmail}
              </Typography>
            )}
          </Box>
        </UserInfoSection>

        <MenuItem component={Link} to={`/${PATH.User}/${PATH.UserProfile}`} onClick={handleMenuClose} disableRipple>
          <PersonOutlineIcon />
          الصفحة الشخصية
        </MenuItem>

        <Divider sx={{ my: 1, borderColor: alpha("#000", 0.06) }} />

        <MenuItem component={Link} to={`/${PATH.User}/${PATH.MyCourses}`} onClick={handleMenuClose} disableRipple>
          <MenuBookIcon />
          دوراتي
        </MenuItem>

        <MenuItem component={Link} to={`/${PATH.User}/${PATH.WishList}`} onClick={handleMenuClose} disableRipple>
          <FavoriteBorderIcon />
          المفضلة
        </MenuItem>

        <MenuItem component={Link} to={`/${PATH.User}/${PATH.CartList}`} onClick={handleMenuClose} disableRipple>
          <ShoppingCartIcon />
          السلة
        </MenuItem>

        <Divider sx={{ my: 1, borderColor: alpha("#000", 0.06) }} />

        <MenuItem
          onClick={!loading ? handleLogout : undefined}
          disableRipple
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: loading ? "text.secondary" : "error.main",
            "&:hover": {
              backgroundColor: loading ? "transparent" : alpha("#f44336", 0.08),
              "& .MuiSvgIcon-root": {
                color: loading ? "text.secondary" : "error.main",
              },
            },
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? <CircularProgress size={20} thickness={5} color="error" /> : <LogoutIcon />}
          <Typography variant="body2" fontWeight={500}>
            {loading ? "جاري تسجيل الخروج..." : "تسجيل خروج"}
          </Typography>
        </MenuItem>
      </StyledMenu>
    </div>
  )
}
