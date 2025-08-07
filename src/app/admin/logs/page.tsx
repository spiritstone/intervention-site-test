"use client";

import { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Participant, LogEntry, SessionEntry } from "@/app/types/logTypes";
import { formatToKoreanTime } from "@/app/utils/format";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { Spinner } from "@heroui/spinner";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LogsPage() {
  // Define columns for each table
  const participantColumns = [
    { key: "userId", label: "User ID" },
    { key: "shortsCount", label: "Shorts Count" },
    { key: "modalDuration", label: "Modal Duration" },
    { key: "modalType", label: "Modal Type" },
  ];
  // const logColumns = [
  //   { key: "userId", label: "User ID" },
  //   { key: "interventionIndex", label: "Intervention Index" },
  //   { key: "shortsWatched", label: "Shorts Watched" },
  //   { key: "modType", label: "Modality Type" },
  //   { key: "modDuration", label: "Modality Duration" },
  //   { key: "startTime", label: "Start Time" },
  //   { key: "stopTime", label: "Stop Time" },
  //   { key: "durationSec", label: "Duration (Sec)" },
  // ];
  const sessionColumns = [
    { key: "session_id", label: "No" },

    { key: "userId", label: "User ID" },
    { key: "actionType", label: "Action Type" },
    { key: "appEnterTime", label: "App Enter" },
    { key: "appExitTime", label: "App Exit" },
    { key: "appDurationSec", label: "App Duration (Seconds)" },
    { key: "shortsEnterTime", label: "Shorts Enter" },
    { key: "shortsExitTime", label: "Shorts Exit" },
    { key: "shortsDurationSec", label: "Shorts Duration (Seconds)" },
    { key: "shortsWatchedTotal", label: "Shorts Watched" },
    // { key: "modalPoints", label: "Modal Points" },
  ];

  // Single API call for all data
  const list = useAsyncList<{
    participants: Participant[];
    logs: LogEntry[];
    sessions: SessionEntry[];
  }>({
    async load() {
      const res = await fetch("/api/admin/logs");
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "데이터를 불러오는 데 실패했습니다.");
      return { items: [json] };
    },
  });

  // Extract the arrays from the fetched data
  const participants = list.items[0]?.participants || [];
  // const logs = list.items[0]?.logs || [];
  const sessions = list.items[0]?.sessions || [];

  // Infinite scroll hooks for each table
  const [participantsLoaderRef, participantsScrollerRef] = useInfiniteScroll({
    hasMore: false,
  });

  // const [logsLoaderRef, logsScrollerRef] = useInfiniteScroll({
  //   hasMore: false,
  // });

  const [sessionsLoaderRef, sessionsScrollerRef] = useInfiniteScroll({
    hasMore: false,
  });

  const tableClassNames = useMemo(
    () => ({
      wrapper: ["px-4 table-auto w-full"],
      thead: [
        "bg-green-200",
        "text-black",
        "border-b",
        "border-divider",
        "sticky",
        "top-0",
        "z-10",
      ],
    }),
    []
  );

  const downloadCSV = async (table: string) => {
    const { data, error } = await supabase
      .from(table)
      .select("*", { head: false })
      .csv();

    if (error) {
      alert(`CSV 다운로드 중 오류 발생: ${error.message}`);
      return;
    }

    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${table}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 bg-white text-black">
      <div className="text-2xl font-bold p-6 text-black">실험 로그</div>
      {/* {list.isLoading && <div className="p-4">불러오는 중...</div>} */}
      {list.error && <div className="text-red-500">{String(list.error)}</div>}
      {/* {!list.isLoading && !list.error && ( */}
      {!list.error && (
        <>
          {/* Participants Table */}
          <div className="p-0">
            <div className="flex justify-between flex-row items-center">
              <div className="text-xl font-semibold px-6 text-black">
                Participants
              </div>
              <div className="text-sm font-semibold px-6 py-2 text-black">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => downloadCSV("participants")}
                >
                  CSV 다운로드
                </button>
              </div>
            </div>
            <Table
              classNames={tableClassNames}
              baseRef={participantsScrollerRef}
              bottomContent={
                <div className="p-2 text-center">
                  <Spinner ref={participantsLoaderRef} color="white" />
                </div>
              }
              aria-label="Participants Table"
              isHeaderSticky
            >
              <TableHeader>
                {participantColumns.map((col) => (
                  <TableColumn
                    key={col.key}
                    className="border px-4 py-2 bg-green-200 sticky top-0 z-10"
                  >
                    {col.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={participants}
                isLoading={list.isLoading}
                loadingContent={<Spinner label="Loading..." />}
              >
                {(item) => (
                  <TableRow key={item.id}>
                    {participantColumns.map((col) => (
                      <TableCell key={col.key} className="border px-4 py-2">
                        {col.key === "shortsCount" ||
                        col.key === "modalDuration" ||
                        col.key === "modalType"
                          ? Array.isArray(item[col.key])
                            ? item[col.key].join(", ")
                            : ""
                          : getKeyValue(item, col.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Sessions Table */}
          <div className="p-0">
            <div className="flex justify-between flex-row items-center">
              <div className="text-xl font-semibold px-6">Sessions</div>
              <div className="text-sm font-semibold px-6 py-2 text-black">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => downloadCSV("sessions")}
                >
                  CSV 다운로드
                </button>
              </div>
            </div>
            <Table
              classNames={tableClassNames}
              baseRef={sessionsScrollerRef}
              bottomContent={
                <div className="p-2 text-center">
                  <Spinner ref={sessionsLoaderRef} color="white" />
                </div>
              }
              aria-label="Sessions Table"
              isHeaderSticky
            >
              <TableHeader>
                {sessionColumns.map((col) => (
                  <TableColumn
                    key={col.key}
                    className="border px-4 py-2 bg-green-200 sticky top-0 z-10"
                  >
                    {col.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={sessions}
                isLoading={list.isLoading}
                loadingContent={<Spinner label="Loading..." />}
              >
                {(item) => (
                  <TableRow key={item.session_id} aria-label="session-row">
                    {sessionColumns.map((col, index) => (
                      <TableCell key={col.key} className="border px-4 py-2">
                        {(() => {
                          const key = col.key as keyof SessionEntry;

                          if (key === "session_id") {
                            return (
                              sessions.findIndex(
                                (s) => s.session_id === item.session_id
                              ) + 1
                            );
                          }

                          if (
                            key === "appEnterTime" ||
                            key === "appExitTime" ||
                            key === "shortsEnterTime" ||
                            key === "shortsExitTime"
                          ) {
                            return formatToKoreanTime(item[key]);
                          }

                          return getKeyValue(item, key);
                        })()}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Logs Table */}
          {/*<div>
            <div className="text-xl font-semibold px-6">Logs</div>

            <Table
              classNames={tableClassNames}
              baseRef={logsScrollerRef}
              bottomContent={
                <div className="p-2 text-center">
                  <Spinner ref={logsLoaderRef} color="white" />
                </div>
              }
              aria-label="Logs Table"
              isHeaderSticky
            >
              <TableHeader>
                {logColumns.map((col) => (
                  <TableColumn
                    key={col.key}
                    className="border px-4 py-2 bg-green-200 sticky top-0 z-10"
                  >
                    {col.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={logs}
                isLoading={list.isLoading}
                loadingContent={<Spinner label="Loading..." />}
              >
                {(item) => (
                  <TableRow key={item.logs_id}>
                    {logColumns.map((col) => (
                      <TableCell key={col.key} className="border px-4 py-2">
                        {col.key === "startTime" || col.key === "stopTime"
                          ? formatToKoreanTime(item[col.key])
                          : getKeyValue(item, col.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div> */}
        </>
      )}
    </div>
  );
}
