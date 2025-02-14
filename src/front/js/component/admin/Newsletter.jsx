import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Trash, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

const NewsletterView = () => {
  const { store, actions } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    actions.fetchnewsletter();
  }, [store.newsletter]);

  const handleDeleteSubscriber = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subscriber!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    });
  
    if (result.isConfirmed) {
      await actions.deleteNewsletterSubscriber(id);
      Swal.fire(
        'Deleted!',
        'The subscriber has been deleted.',
        'success'
      );
    } else {
      Swal.fire(
        'Cancelled',
        'The subscriber is safe :)',
        'error'
      );
    }
  };
  

  const newsletterData = Array.isArray(store.newsletter) ? store.newsletter : [];
  const filteredSubscribers = newsletterData.filter((subscriber) =>
    subscriber?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Newsletter Subscribers Management</h1>
        </header>
        <main className="tw-p-6">
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Newsletter Subscribers</h2>
            <div className="tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-4">
              <div className="tw-relative tw-w-full md:tw-w-auto">
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tw-pl-10 tw-pr-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-w-full"
                />
                <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" size={20} />
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="tw-p-2 tw-rounded-md tw-bg-gray-100 tw-text-gray-600 disabled:tw-opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="tw-text-sm tw-text-gray-600">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="tw-p-2 tw-rounded-md tw-bg-gray-100 tw-text-gray-600 disabled:tw-opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="tw-space-y-4">
              {currentSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
                  <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-mb-2 tw-gap-4">
                    <div className="tw-text-center md:tw-text-left">
                      <span className="tw-font-bold">Email</span>
                      <p className="tw-text-sm tw-text-gray-500">{subscriber.email}</p>
                    </div>
                  </div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                    <button
                      className="tw-text-blue-600 hover:tw-text-blue-800 tw-flex tw-items-center"
                      onClick={() => setSelectedSubscriber(subscriber)}
                    >
                      <Eye className="tw-w-5 tw-h-5 tw-mr-1" />
                      View Details
                    </button>
                    <button
                      className="tw-text-red-600 hover:tw-text-red-800"
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                    >
                      <Trash className="tw-w-5 tw-h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {selectedSubscriber && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full"
          id="my-modal"
        >
          <div className="tw-relative tw-top-20 tw-mx-auto tw-p-5 tw-border tw-w-full md:tw-w-96 tw-shadow-lg tw-rounded-md tw-bg-white">
            <div className="tw-mt-3 tw-text-center">
              <h3 className="tw-text-lg tw-leading-6 tw-font-medium tw-text-gray-900">Subscriber Details</h3>
              <div className="tw-mt-2 tw-px-7 tw-py-3">
                <p className="tw-text-sm tw-text-gray-500">
                  <strong>Email:</strong> {selectedSubscriber.email}
                </p>
              </div>
              <div className="tw-items-center tw-px-4 tw-py-3">
                <button
                  id="ok-btn"
                  className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-text-base tw-font-medium tw-rounded-md tw-w-full tw-shadow-sm hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-300"
                  onClick={() => setSelectedSubscriber(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterView;