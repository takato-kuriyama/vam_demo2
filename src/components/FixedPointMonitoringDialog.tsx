import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { MonitoringDataField } from "../constants/constants";
import { X } from "lucide-react";

interface FixedPointMonitoringDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: MonitoringDataField;
}

export const FixedPointMonitoringDialog: React.FC<
  FixedPointMonitoringDialogProps
> = ({ isOpen, onClose, data }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-4">
          <DialogTitle className="text-xl font-bold">
            {data.line} - {data.date}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* ろ過システムデータ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ろ過部データ</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50 w-1/3">項目</th>
                  <th className="border p-2 bg-gray-50 w-1/3">測定値</th>
                  <th className="border p-2 bg-gray-50 w-1/3">基準値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">活性炭前残留塩素濃度</td>
                  <td className="border p-2">3.8ppm</td>
                  <td className="border p-2">3.0～4.5ppm</td>
                </tr>
                <tr>
                  <td className="border p-2">活性炭後残留塩素濃度</td>
                  <td className="border p-2">0.0ppm</td>
                  <td className="border p-2">0.0～0.5ppm</td>
                </tr>
                <tr>
                  <td className="border p-2">アンモニア</td>
                  <td className="border p-2 font-semibold bg-red-200">
                    0.7ppm
                  </td>
                  <td className="border p-2">0.0～0.5ppm</td>
                </tr>
                <tr>
                  <td className="border p-2">pH</td>
                  <td className="border p-2">7.5</td>
                  <td className="border p-2">6.5～8.0</td>
                </tr>
                <tr>
                  <td className="border p-2">流量値</td>
                  <td className="border p-2">30.0L/min</td>
                  <td className="border p-2">25.0～35.0L/min</td>
                </tr>
                <tr>
                  <td className="border p-2">電解電流値</td>
                  <td className="border p-2">27.0A</td>
                  <td className="border p-2">24.0～30.0A</td>
                </tr>
                <tr>
                  <td className="border p-2">水温</td>
                  <td className="border p-2">26.2℃</td>
                  <td className="border p-2">24.0～27.0℃</td>
                </tr>
                <tr>
                  <td className="border p-2">電解極性</td>
                  <td className="border p-2">A</td>
                  <td className="border p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 飼育槽データ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">飼育槽データ</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50">水槽</th>
                  <th className="border p-2 bg-gray-50">A-1</th>
                  <th className="border p-2 bg-gray-50">A-2</th>
                  <th className="border p-2 bg-gray-50">A-3</th>
                  <th className="border p-2 bg-gray-50">A-4</th>
                  <th className="border p-2 bg-gray-50">A-5</th>
                  <th className="border p-2 bg-gray-50">下限</th>
                  <th className="border p-2 bg-gray-50">上限</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">酸素飽和度</td>
                  <td className="border p-2">80%</td>
                  <td className="border p-2">84%</td>
                  <td className="border p-2 font-semibold bg-yellow-200">
                    72%
                  </td>
                  <td className="border p-2">95%</td>
                  <td className="border p-2 font-semibold bg-red-200">54%</td>
                  <td className="border p-2">70%</td>
                  <td className="border p-2">100%</td>
                </tr>
                <tr>
                  <td className="border p-2">pH</td>
                  <td className="border p-2">7.1</td>
                  <td className="border p-2">9.3</td>
                  <td className="border p-2">6.8</td>
                  <td className="border p-2">7.5</td>
                  <td className="border p-2">7.2</td>
                  <td className="border p-2">6.5</td>
                  <td className="border p-2">8.0</td>
                </tr>
                <tr>
                  <td className="border p-2">水温</td>
                  <td className="border p-2 font-semibold bg-red-200">24.2℃</td>
                  <td className="border p-2">26.8℃</td>
                  <td className="border p-2">26.0℃</td>
                  <td className="border p-2 font-semibold bg-yellow-200">
                    25.2℃
                  </td>
                  <td className="border p-2 font-semibold bg-red-200">29.1℃</td>
                  <td className="border p-2">25.0℃</td>
                  <td className="border p-2">27.0℃</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 水槽画像エリア */}
          <div>
            <h3 className="text-lg font-semibold mb-4">水槽画像</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* A-1からA-3の水槽 */}
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                  <span className="text-gray-600">画像 A-1</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                  <span className="text-gray-600">画像 A-2</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                  <span className="text-gray-600">画像 A-3</span>
                </div>
              </div>
              {/* A-4とA-5の水槽 */}
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                  <span className="text-gray-600">画像 A-4</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                  <span className="text-gray-600">画像 A-5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
