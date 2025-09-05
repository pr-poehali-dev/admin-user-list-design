import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import Icon from '@/components/ui/icon';

// Типы данных
type Role = 'admin' | 'moderator' | 'user' | 'guest';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  lastActivity: string;
  permissions: string[];
}

// Мок-данные пользователей
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    role: 'admin',
    status: 'active',
    lastActivity: '2024-09-05',
    permissions: ['users.read', 'users.write', 'settings.write', 'moderation.write']
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria.sidorova@example.com',
    role: 'moderator',
    status: 'active',
    lastActivity: '2024-09-04',
    permissions: ['users.read', 'moderation.write']
  },
  {
    id: '3',
    name: 'Алексей Козлов',
    email: 'alex.kozlov@example.com',
    role: 'user',
    status: 'active',
    lastActivity: '2024-09-05',
    permissions: ['users.read']
  },
  {
    id: '4',
    name: 'Светлана Волкова',
    email: 'svetlana.volkova@example.com',
    role: 'moderator',
    status: 'inactive',
    lastActivity: '2024-08-28',
    permissions: ['users.read', 'moderation.write']
  },
  {
    id: '5',
    name: 'Дмитрий Соколов',
    email: 'dmitry.sokolov@example.com',
    role: 'guest',
    status: 'active',
    lastActivity: '2024-09-03',
    permissions: []
  }
];

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  moderator: 'bg-blue-100 text-blue-800 border-blue-200',
  user: 'bg-green-100 text-green-800 border-green-200',
  guest: 'bg-gray-100 text-gray-800 border-gray-200'
};

const roleLabels = {
  admin: 'Администратор',
  moderator: 'Модератор',
  user: 'Пользователь',
  guest: 'Гость'
};

const Index = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState('users');

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    moderators: users.filter(u => u.role === 'moderator').length
  };

  const menuItems = [
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
    { id: 'moderation', label: 'Модерация', icon: 'Shield' }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">Система управления</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className="w-full justify-start hover-scale"
                  >
                    <Icon name={item.icon as any} size={18} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Управление пользователями</h2>
                <p className="text-sm text-gray-600 mt-1">Система ролей и прав доступа</p>
              </div>
              <Button className="hover-scale">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить пользователя
              </Button>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Users" size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Всего пользователей</p>
                      <p className="text-2xl font-semibold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon name="UserCheck" size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Активных</p>
                      <p className="text-2xl font-semibold">{stats.active}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Crown" size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Администраторов</p>
                      <p className="text-2xl font-semibold">{stats.admins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Shield" size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Модераторов</p>
                      <p className="text-2xl font-semibold">{stats.moderators}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Фильтры и поиск */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Поиск</label>
                    <Input
                      placeholder="Поиск по имени или email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Роль</label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все роли</SelectItem>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="moderator">Модератор</SelectItem>
                        <SelectItem value="user">Пользователь</SelectItem>
                        <SelectItem value="guest">Гость</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Статус</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все статусы</SelectItem>
                        <SelectItem value="active">Активные</SelectItem>
                        <SelectItem value="inactive">Неактивные</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Таблица пользователей */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={20} />
                  Список пользователей ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Последняя активность</TableHead>
                      <TableHead>Права доступа</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: Role) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>
                                <Badge className={roleColors[user.role]} variant="outline">
                                  {roleLabels[user.role]}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Администратор</SelectItem>
                              <SelectItem value="moderator">Модератор</SelectItem>
                              <SelectItem value="user">Пользователь</SelectItem>
                              <SelectItem value="guest">Гость</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {user.status === 'active' ? 'Активен' : 'Неактивен'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {user.lastActivity}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.slice(0, 2).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                            {user.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusToggle(user.id)}
                              className="hover-scale"
                            >
                              <Icon 
                                name={user.status === 'active' ? 'UserX' : 'UserCheck'} 
                                size={16} 
                              />
                            </Button>
                            <Button size="sm" variant="outline" className="hover-scale">
                              <Icon name="Edit" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;