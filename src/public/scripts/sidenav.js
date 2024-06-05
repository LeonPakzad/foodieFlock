function openNav() 
{
    document.getElementById("sidenav").style.width = "250px";
}
  
function closeNav() 
{
    document.getElementById("sidenav").style.width = "50px";
}

function toggleNav() 
{
    sidenav = document.getElementById("sidenav")
    sidenavClosed = sidenav.getAttribute("sidenav-closed")

    if(sidenavClosed === "true")
    {
        openNav()
        sidenav.setAttribute("sidenav-closed", false)
    }
    else
    {
        closeNav()
        sidenav.setAttribute("sidenav-closed", true)
    }
}