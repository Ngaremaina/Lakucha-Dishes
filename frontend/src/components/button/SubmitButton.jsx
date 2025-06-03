import { Button } from "@material-tailwind/react";

export default function SubmitButton({ text = "Submit", loading = false }) {
    return (
      <Button
        type="submit"
        disabled={loading}
        className={`mt-4 py-3 px-6 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Submitting..." : text}
      </Button>
    );
  }
  