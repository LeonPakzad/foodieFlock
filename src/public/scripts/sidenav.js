function toggleNav() 
{
    sidenav = document.getElementById("sidenav")
    sidenavClosed = sidenav.getAttribute("sidenav-closed")

    if(sidenavClosed === "true")
    {
        sidenav.setAttribute("sidenav-closed", false)
    }
    else
    {
        sidenav.setAttribute("sidenav-closed", true)
    }
}