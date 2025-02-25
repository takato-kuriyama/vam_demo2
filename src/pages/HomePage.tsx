import { Link } from "react-router-dom";
import { COLORS, PAGE_TITLES, DASHBOARDS } from "../constants/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { PageContainer } from "../components/PageContainer";
import { useState } from "react";
import { Textarea } from "../components/textarea";
import { CirclePlus, Check } from "lucide-react";

const HomePage = () => {
  const [memo, setMemo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [displayText, setDisplayText] = useState(
    "ここに任意のメモを残せます　(一つでいいですか？)"
  );

  const handleSaveMemo = () => {
    if (memo.trim()) {
      setDisplayText(memo);
    }
    setIsEditing(false);
  };

  return (
    <PageContainer title={PAGE_TITLES.HOME}>
      <div className="space-y-4">
        {/* 本日の情報とアラート */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>本日の給餌量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-16">
                <div>
                  <span className="font-semibold text-2xl">Aライン</span>
                  <span className="ml-4 text-2xl">635g</span>
                </div>
                <div>
                  <span className="font-semibold text-2xl">Bライン</span>
                  <span className="ml-4 text-2xl">658g</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>メモ</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-5 items-center">
              {isEditing ? (
                <>
                  <Textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="メモを入力"
                    rows={4}
                    className="flex-grow"
                  />
                  <Check
                    className="text-green-500 cursor-pointer"
                    onClick={handleSaveMemo}
                  />
                </>
              ) : (
                <>
                  <CirclePlus
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  />
                  <p className="text-left text-gray-500 whitespace-pre-wrap">
                    {displayText}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ダッシュボードと定点観測 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>ダッシュボード</CardTitle>
            </CardHeader>
            <CardContent className={`space-y-2`}>
              {DASHBOARDS.map((dashboard) => (
                <Link
                  key={dashboard.id}
                  to={dashboard.path}
                  className={`p-3 border ${COLORS.border.secondary} transition-all duration-300 hover:shadow-lg hover:scale-102  rounded-xl cursor-pointer block`}
                >
                  {dashboard.name}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>定点観測通知</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500">
                定点観測の通知が簡易的に
                <br />
                ここに表示されます
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
