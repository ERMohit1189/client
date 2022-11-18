import React from 'react';

class Header extends React.Component
{
  render()
  {
    return (
<div>
<div id="page-container">       
<div class="header-area">
<div class="header-area-left">
    <a href="index.html" class="logo">
        <span>
            <img src="assets/images/logo.png" alt="" height="18"/>
        </span>
        <i>
            <img src="assets/images/logo-collapsed.svg" alt="" height="22"/>
        </i>
    </a>
</div>
<div class="row align-items-center header_right">
    {/* <div class="col-md-6 d_none_sm d-flex align-items-center">
        <div class="nav-btn button-menu-mobile pull-left">
            <button class="open-left waves-effect">
            <i class="fa fa-bars" aria-hidden="true"></i>
            </button>
        </div>
       
    </div> */}
    <div class="col-md-12 col-sm-12">
        <ul class="notification-area pull-right">
            
          
            
            <li class="user-dropdown">
                <a href=''><i class="fa fa-sign-out" aria-hidden="true"></i></a>
            </li>
        </ul>
    </div>
</div>

</div>

{/* <div class="sidebar_menu">
        <div class="menu-inner">
            <div id="sidebar-menu">
                <ul class="metismenu" id="sidebar_menu">
                    <li>
                        <a href="index.html">
                        <i class="fa fa-tachometer" aria-hidden="true"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0)" aria-expanded="true">
                        <i class="fa fa-archive" aria-hidden="true"></i>
                            <span>UI Features</span>
                            <span class="float-right arrow"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                        </a>
                        <ul class="submenu">
                            <li><a href="/filelayouts"><i class="fa fa-angle-right" aria-hidden="true"></i><span>Alert</span></a></li>
                            <li><a href="accordion.html"><i class="fa fa-angle-right" aria-hidden="true"></i><span>Accordion</span></a></li>
                            <li><a href="buttons.html"><i class="fa fa-angle-right" aria-hidden="true"></i><span>Buttons</span></a></li>
                            <li><a href="badges.html"><i class="fa fa-angle-right" aria-hidden="true"></i><span>Badges</span></a></li>
                           
                        </ul>
                    </li>
                  
                   
                </ul>
            </div>
            <div class="clearfix"></div>
        </div>
    </div> */}


</div>
</div>
      
    )
  }
}
export default Header;