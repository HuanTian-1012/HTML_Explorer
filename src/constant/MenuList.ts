const MenuList: MenuListType[] = [{
    id:1,
    name:'测试1'
}];

export default MenuList;

interface MenuListType {
  id: number;
  name: string;
  path: string;
}
