import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Bell, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/constants";

interface NotificationItem {
  id: string;
  date: string;
  message: string;
  resolved: boolean;
  line: string;
  tank: string;
}

export const AlertMenuDialog = () => {
  // 通知のサンプルデータ
  const [notifications] = useState<NotificationItem[]>([
    {
      id: "1",
      date: "2024/11/03 10:30",
      message: "酸素濃度が閾値を上回りました。",
      resolved: false,
      line: "Aライン",
      tank: "A2水槽",
    },
    {
      id: "2",
      date: "2024/11/03 10:15",
      message: "アンモニア濃度が上昇しています。",
      resolved: true,
      line: "Bライン",
      tank: "B1水槽",
    },
  ]);

  // 未解決の通知数を計算
  const unreadCount = notifications.filter((n) => !n.resolved).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-0">
          <Bell className="h-7 w-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h3 className="font-semibold">通知</h3>
          <Link
            to={ROUTES.ALERT_HISTORY}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            アラート一覧へ
          </Link>
        </div>
        <div className="max-h-96 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                to={ROUTES.ALERT_HISTORY}
                key={notification.id}
                className={`p-4 border-b transition-colors cursor-pointer hover:bg-gray-50 block no-underline
                  ${!notification.resolved ? "bg-red-100" : "bg-white"}`}
              >
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-gray-500">{notification.date}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {notification.resolved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        notification.resolved
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {notification.resolved ? "解決済み" : "未解決"}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">
                  {notification.message}
                </p>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span>{notification.line}</span>
                  <span>{notification.tank}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              通知はありません
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
