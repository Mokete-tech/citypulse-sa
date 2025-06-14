
import { useDeals } from "@/hooks/useDeals";
import { useEvents } from "@/hooks/useEvents";

const StatsSection = () => {
  const { data: deals = [] } = useDeals();
  const { data: events = [] } = useEvents();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl font-bold text-blue-600 mb-2">{deals.length}</div>
            <div className="text-gray-600">Active Deals</div>
          </div>
          <div className="hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl font-bold text-green-600 mb-2">{events.length}</div>
            <div className="text-gray-600">Upcoming Events</div>
          </div>
          <div className="hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
          <div className="hover:scale-105 transition-transform cursor-pointer">
            <div className="text-3xl font-bold text-orange-600 mb-2">800+</div>
            <div className="text-gray-600">Local Businesses</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
