import { Button } from "antd";

export default function SeatMap({ seats = [], onSelect, selected }) {
  return (
    <div className="grid grid-cols-10 gap-2 p-4">
      {seats.map((seat) => (
        <Button
          key={seat.maGhe}
          type={selected.includes(seat.maGhe) ? "primary" : "default"}
          danger={seat.daDat}
          disabled={seat.daDat}
          onClick={() => onSelect(seat)}
        >
          {seat.tenGhe}
        </Button>
      ))}
    </div>
  );
}
