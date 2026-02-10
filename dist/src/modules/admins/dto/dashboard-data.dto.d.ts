export declare class DashboardDataDto {
    ongoingTrips: number;
    activeDrivers: number;
    activeUsers: number;
    pendingDisputes: number;
    pendingPayouts: number;
    revenueStats: {
        totalRevenue: number;
        monthlyBreakdown: [];
    };
    todayStats: {
        profit: number;
        trips: number;
        hourlyChart: [];
    };
}
