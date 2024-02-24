import React from "react";

function Sidebar() {
  return (
    <nav
      id="sidebarMenu"
      class="col-md-3 col-lg-1 d-md-block bgg-light sidebar collapse ld_item"
    >
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item hover-effect">
            <a class="nav-link ld_itema" href="#get">
              Get Method
            </a>
          </li>
          <li class="nav-item hover-effect">
            <a class="nav-link ld_itema" href="#post">
              Post Method
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
