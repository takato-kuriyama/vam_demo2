import { Link } from "react-router-dom";
import { useState } from "react";
import { COLORS } from "../constants/ui";
import { PAGE_TITLES } from "../constants/routes";
import { DASHBOARDS } from "../constants/menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { PageContainer } from "../components/layouts/PageContainer";
import { Textarea } from "../components/ui/textarea";
import { CirclePlus, Check, Trash2 } from "lucide-react";
import { useDashboardData } from "../hooks/useDataStore";

const HomePage = () => {
  const [memo, setMemo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [displayText, setDisplayText] = useState("ここに任意のメモを残せます");
  const [hasMemo, setHasMemo] = useState(true);

  // ダッシュボードデータフックを使用
  const { dashboardData, isLoading, error } = useDashboardData();

  const handleSaveMemo = () => {
    if (memo.trim()) {
      setDisplayText(memo);
      setHasMemo(true);
    }
    setIsEditing(false);
  };

  const handleDeleteMemo = () => {
    setDisplayText("");
    setMemo("");
    setHasMemo(false);
  };

  // データローディング中またはエラー時の処理
  if (isLoading) {
    return (
      <PageContainer title={PAGE_TITLES.HOME}>
        <div className="text-center text-gray-500">データをロード中...</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title={PAGE_TITLES.HOME}>
        <div className="text-center text-red-500">
          データの読み込みにエラーが発生しました
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={PAGE_TITLES.HOME}>
      <div className="space-y-6">
        {/* 本日の情報とメモ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">本日の給餌量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-3 sm:space-y-0">
                {Object.entries(dashboardData.todayFeedingTotal).map(
                  ([lineId, total]) => (
                    <div
                      key={lineId}
                      className="bg-blue-50 rounded-lg px-4 py-3 text-center sm:text-left flex-1"
                    >
                      <span className="font-semibold text-blue-700">
                        {lineId}ライン
                      </span>
                      <p className="text-xl font-bold text-blue-800">
                        {total.toFixed(0)}g
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">メモ</CardTitle>
              {/* スマホでタイトル横に＋ボタンを表示 */}
              <div className="sm:hidden flex">
                {!isEditing && (
                  <CirclePlus
                    className="text-gray-500 cursor-pointer h-5 w-5"
                    onClick={() => setIsEditing(true)}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5 items-center">
                {isEditing ? (
                  <>
                    <Textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="メモを入力"
                      rows={4}
                      className="flex-grow w-full"
                    />
                    <div className="flex justify-end w-full sm:w-auto space-x-3">
                      <Check
                        className="text-green-500 cursor-pointer h-6 w-6"
                        onClick={handleSaveMemo}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* PCサイズでのみ表示する＋ボタン */}
                    <CirclePlus
                      className="hidden sm:block text-gray-500 cursor-pointer h-5 w-5"
                      onClick={() => setIsEditing(true)}
                    />
                    <p className="text-center sm:text-left text-gray-500 whitespace-pre-wrap flex-grow">
                      {hasMemo ? displayText : "メモがありません"}
                    </p>
                    {hasMemo && (
                      <Trash2
                        className="text-red-500 cursor-pointer h-5 w-5"
                        onClick={handleDeleteMemo}
                      />
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 電流値とダッシュボード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">現在の電流値</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-3 sm:space-y-0">
                {Object.entries(dashboardData.todayFeedingTotal).map(
                  ([lineId, total]) => (
                    <div
                      key={lineId}
                      className="bg-blue-50 rounded-lg px-4 py-3 text-center sm:text-left flex-1"
                    >
                      <span className="font-semibold text-blue-700">
                        {lineId}ライン
                      </span>
                      <p className="text-xl font-bold text-blue-800">12.1A</p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ダッシュボード</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DASHBOARDS.map((dashboard) => (
                  <Link
                    key={dashboard.id}
                    to={dashboard.path}
                    className={`p-3 border ${COLORS.border.secondary} bg-white hover:bg-blue-50 transition-colors rounded-xl cursor-pointer block`}
                  >
                    <p className="font-medium text-blue-700">
                      {dashboard.name}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
