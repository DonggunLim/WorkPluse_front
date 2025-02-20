type SideMenuProps = {
  setActivePage: (page: string) => void; // 페이지 변경을 위한 함수
};

const SideMenu: React.FC<SideMenuProps> = ({ setActivePage }) => {
  const sideMenus = [
    { label: "유저목록", path: "home" },
    { label: "근태관리", path: "attendance" },
    { label: "휴가관리", path: "vacation" },
  ];

  return (
    <div className="bg-[#5B84F5] w-[22%] h-screen">
      <ul>
        {sideMenus.map((menu) => (
          <li
            key={menu.path}
            className="flex items-center p-4 hover:bg-[#7A9BFF] cursor-pointer text-white"
            onClick={() => setActivePage(menu.path)}
          >
            {menu.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
